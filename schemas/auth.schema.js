const { z } = require("zod");

const registerSchema = z.object({
  name: z.string({
    required_error: "Name es requerido",
  }),
  email: z
    .string({
      required_error: "Email es requerido",
    })
    .email({
      message: "Email invalido",
    }),
  password: z
    .string({
      required_error: "Password es requerido",
    })
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    }),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email es requerido" })
    .email({ message: "Email invalido" }),
  password: z
    .string({ required_error: "Password es requerido" })
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

module.exports = { registerSchema, loginSchema };
