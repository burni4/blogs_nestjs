import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ versionKey: false })
export class SecurityDevice {
  @Prop()
  id: string;
}

export type SecurityDeviceDocument = HydratedDocument<SecurityDevice>;
export const SecurityDeviceSchema =
  SchemaFactory.createForClass(SecurityDevice);
