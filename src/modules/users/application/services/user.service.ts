import { Injectable, Logger } from "@nestjs/common";
import { 
  CreateUserRequest, 
  FindOneUserRequest, 
  FindUserImageResponse, 
  UpdateUserImageRequest, 
  UpdateUserImageResponse, 
  UpdateUserRequest, 
  UserResponseDto 
} from "../../interface/dto/user.dto";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateUserCommand } from "../command/create-user.command";
import { UserViewMapper } from "../../interface/mapper/user-view.mapper";
import { ImageNotFoundError, UserNotFoundError } from "../errors/user.error";
import { UpdateUserCommand } from "../command/update-user.command";
import { DeleteUserCommand } from "../command/delete-user.command";
import { FindOneUserQuery } from "../query/find-one-user.query";
import { UploadGrpcService } from "src/modules/uploads-grpc/upload-grpc.service";
import { randomUUID } from "crypto";
import { UpdateUserImageCommand } from "../command/update-user-image.command";
import { UserEntity } from "../../infrastucture/persistence/entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly uploadGrpcService: UploadGrpcService,
  ) {}

  async createUser(
    body: CreateUserRequest,
  ): Promise<UserResponseDto> {
    const createdUser = await this.commandBus.execute(
      new CreateUserCommand(body),
    );

    return UserViewMapper.toResponseDto(createdUser);
  }

  async updateUser(
    params: FindOneUserRequest,
    body: UpdateUserRequest,
  ): Promise<UserResponseDto> {
    const updated = await this.commandBus.execute(
      new UpdateUserCommand({ id: params.id, ...body })
    );

    if (!updated) throw new UserNotFoundError(params.id);

    return UserViewMapper.toResponseDto(updated);
  }

  async deleteUser(
    params: FindOneUserRequest,
  ): Promise<void> {
    const deleted =await this.commandBus.execute(
      new DeleteUserCommand(params.id),
    );

    if (!deleted) throw new UserNotFoundError(params.id);

    return;
  }

  async updateUserImage(data: UpdateUserImageRequest): Promise<UpdateUserImageResponse> {
    const { user_id, image } = data;
    const user = await this.queryBus.execute(new FindOneUserQuery(user_id));
    if (!user) throw new UserNotFoundError(user_id);

    const oldKey = user.avatar_path as string | null;
    const { originalname, mimetype, size, buffer } = image;
    const fileName = `${randomUUID()}-${originalname}`;

    const uploaded = await this.uploadGrpcService.uploadUserImage({
      user_id,
      data: buffer!,
      filename: fileName,
      mime_type: mimetype,
      size: size!,
    });

    try {
      await this.commandBus.execute(
        new UpdateUserImageCommand(user_id, uploaded.object_key),
      );
    } catch (dbErr) {
      this.uploadGrpcService.deleteUserImage?.({
        user_id,
        object_key: uploaded.object_key,
      }).catch((e: any) =>
        Logger.warn(`Compensation delete failed for ${uploaded.object_key}: ${e?.message}`),
      );
      throw dbErr;
    }

    if (oldKey && oldKey !== uploaded.object_key) {
      this.uploadGrpcService.deleteUserImage?.({ user_id, object_key: oldKey })
        .catch((e: any) =>
          Logger.warn(`Old avatar cleanup failed for ${oldKey}: ${e?.message}`),
        );
    }

    return { user_id, image_url: uploaded.url };
  }

  async findUserImage(user_id: string): Promise<FindUserImageResponse> {
    const userData: UserEntity | null = await this.queryBus.execute(
      new FindOneUserQuery(user_id),
    )
    if (!userData) throw new UserNotFoundError(user_id);
    if (!userData.avatar_path) throw new ImageNotFoundError(user_id); 

    const image = await this.uploadGrpcService.getUserImage({ 
      user_id: userData.id,
      object_key: userData.avatar_path,
      inline: true,
      expires_in: 900,
    });

    return { user_id, image_url: image.url };
  }
}
