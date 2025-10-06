import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export function AtLeastOneProperty(
  propertyNames: string[], // e.g., ['name', 'email']
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOneProperty',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(_value: any, args: ValidationArguments) {
          const obj = args.object as any;
          // Check if at least one specified property has a truthy value (not null/undefined/empty string)
          const hasAtLeastOne = propertyNames.some(prop => {
            const propValue = obj[prop];
            return propValue !== null && propValue !== undefined && propValue !== '';
          });
          if (!hasAtLeastOne) {
            throw new BadRequestException(
              `At least one of the following fields must be provided: ${propertyNames.join(', ')}`,
            );
          }
          return true; // Validation passes
        },
        defaultMessage(_args: ValidationArguments) {
          return `At least one of ${propertyNames.join(', ')} must be provided`;
        },
      },
    });
  };
}
