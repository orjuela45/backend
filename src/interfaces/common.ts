import { Schema } from "joi";

export interface CustomOptionsInterface{
  customMessage?: string
}

export interface RouterOptionsInterface{
  onlyConsult?: boolean,
  createSchema?: Schema,
  updateSchema?: Schema,
  canValidateToken?: boolean
}