import { BadRequest } from "../errors/custom-errors";

async function validate(schema, fields) {
  try {
    return await schema.validate(fields, {
      stripUnknown: true,
      abortEarly: false,
    });
  } catch (e) {
    throw new BadRequest({ message: e.errors });
  }
}

export { validate };
