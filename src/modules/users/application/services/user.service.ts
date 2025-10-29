import { Injectable } from "@nestjs/common";
import { 
  CreateUserRequest, 
  FindOneUserRequest, 
  UpdateUserImageRequest, 
  UpdateUserRequest, 
  UserResponseDto 
} from "../../interface/dto/user.dto";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateUserCommand } from "../command/create-user.command";
import { UserViewMapper } from "../../interface/mapper/user-view.mapper";
import { UserNotFoundError } from "../errors/user.error";
import { UpdateUserCommand } from "../command/update-user.command";
import { DeleteUserCommand } from "../command/delete-user.command";
import { FindOneUserQuery } from "../query/find-one-user.query";
import { UploadGrpcService } from "src/modules/uploads-grpc/upload-grpc.service";
import { randomUUID } from "crypto";

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

  async updateUserImage(
    data: UpdateUserImageRequest,
  ): Promise<void> {
    const { user_id, image } = data;
    const userData = await this.queryBus.execute(
      new FindOneUserQuery(user_id),
    );
    if (!userData) throw new UserNotFoundError(user_id);
    
    const { originalname, mimetype, size, buffer } = image;
    const fileName = `${randomUUID()}-${originalname}`;
    
    // TODO: sending chunks
    const uploadedImage = await this.uploadGrpcService.uploadUserImage({
      user_id,
      data: buffer!,
      filename: fileName,
      mime_type: mimetype,
      size: size!,
      trace_id: randomUUID(),
    });


    // TODO: response from gRPC
    console.log("uploaded image", uploadedImage);
  }
}
