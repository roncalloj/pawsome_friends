import { z } from 'zod'

const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const MAX_UPLOAD_SIZE = 1024 * 1024 * 1024 * 5

const imageSchema = z
  .instanceof(File)
  .refine((file) => {
    return !file || file.size <= MAX_UPLOAD_SIZE
  }, 'File size must be less than 5MB')
  .refine((file) => {
    return ACCEPTED_FILE_TYPES.includes(file.type)
  }, 'Invalid file type')

export const addPetFormSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener minimo 3 letras'),
  species: z.string().min(1, 'La especie debe estar definida'),
  sex: z.string().max(6, 'El sexo solo puede ser macho o hembra').min(1, 'El sexo debe estar definido'),
  breed: z.string().max(50, 'La raza debe tener máximo 50 letras').min(4, 'La raza debe estar definida'),
  description: z.string().max(150, 'La descripcion debe tener máximo 50 letras').min(5, 'Descripcion muy corta'),
  size: z.string().max(7, 'El tamaño solo puede ser pequeño, mediano o grande').min(4, 'El tamaño debe estar definido'),
  vaccinated: z.coerce.boolean(),
  sterilized: z.coerce.boolean(),
  birthDate: z.date(),
  firstImage: imageSchema,
  secondImage: imageSchema
})

export const defaultValues = {
  name: '',
  species: '',
  sex: '',
  breed: '',
  vaccinated: false,
  sterilized: false,
  size: '',
  birthDate: undefined,
  description: '',
  firstImage: '',
  secondImage: ''
}
