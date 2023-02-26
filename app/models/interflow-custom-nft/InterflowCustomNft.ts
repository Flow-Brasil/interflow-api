import { User } from "@models/users/User";
import {
  DataType,
  Column,
  Model,
  PrimaryKey,
  Table,
  ForeignKey,
  BelongsTo,
  Default,
} from "sequelize-typescript";

@Table
export class InterflowCustomNft extends Model {

  @Default(DataType.UUIDV1)
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING)
  customNftUuid!: string;

  @Column(DataType.STRING)
  customNftId!: string;

  @Column(DataType.BOOLEAN)
  aiGeneratedImage!: boolean;

  @Column(DataType.STRING)
  customNftImageLink!: string;

  @Column(DataType.STRING)
  originalNftImageLink!: string;

  @Column(DataType.STRING)
  originalNftCollectionName!: string;

  @Column(DataType.STRING)
  originalNftType!: string;

  @Column(DataType.BOOLEAN)
  minted!: boolean;

  @Column(DataType.STRING)
  jobId!: string;

  @Column(DataType.BOOLEAN)
  readyToReveal!: boolean;

  @Column(DataType.BOOLEAN)
  revealed!: boolean;

  @Column(DataType.STRING)
  userInterflowAddress!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @BelongsTo(() => User)
  user!: User;
}
