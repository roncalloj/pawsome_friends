import { Button } from '@/components/ui/index'
import { booleanOptions, sexOptions, specieOptions } from '@/data/constants'
import { addPetFormSchema } from '@/lib/zod-validations/addPetFormSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { BooleanField } from './BooleanField'
import { BooleanFieldWithIcons } from './BooleanFieldWithIcons'
import { BreedField } from './BreedField'
import { DateField } from './DateField'
import { ImageField } from './ImageField'
import { SizeField } from './SizeField'
import { TextField } from './TextField'

export function AddPetForm({ defaultValues, onSubmit }) {
  const form = useForm({
    resolver: zodResolver(addPetFormSchema),
    defaultValues
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-md border bg-secondary p-12">
        <TextField field={'name'} label={'Nombre'} placeholder={'Rocco'} description={'Nombre de la mascota'} />
        <BooleanFieldWithIcons field={'species'} label={'Especie'} options={specieOptions} />
        <BooleanFieldWithIcons field={'sex'} label={'Sexo de la mascota'} options={sexOptions} />
        <SizeField />
        <BooleanField field={'sterilized'} label={'¿La mascota está esterilizada?'} options={booleanOptions} />
        <BooleanField field={'vaccinated'} label={'¿La mascota está vacunada?'} options={booleanOptions} />
        <TextField
          field={'description'}
          label={'Descripción'}
          placeholder={'Rocco es un perro muy hiperactivo!'}
          description={'Descripción de la mascota'}
        />
        <BreedField />
        <DateField />
        <ImageField />
        <Button>Enviar</Button>
      </form>
    </FormProvider>
  )
}
