import 'dotenv/config'
import { uploadImage } from '../config/cloudinary.config.js'
import Pet from '../models/pet.model.js'
import Request from '../models/request.model.js'
import Shelter from '../models/shelter.model.js'

const findAllPets = async (req, res) => {
  const shelterId = req.shelterId // geting shelterId from jwt middelware
  try {
    const allDaPets = await Pet.find({ shelter: shelterId })
    res.json({ pets: allDaPets })
  } catch (error) {
    res.status(400).json({ message: 'Something went wrong', error: error.message })
  }
}

const findPetsWithQuery = (req, res) => {
  const { query } = req.params
  if (query === 'true') findAllAdoptablePets(req, res)
  else findOneSinglePet(req, res)
}

const findOneSinglePet = async (req, res) => {
  const { query } = req.params
  try {
    const oneSinglePet = await Pet.findOne({ _id: query }).populate('shelter', '-password -createdAt -updatedAt -__v -pets') // Poblar la referencia al refugio
    res.json({ pet: oneSinglePet })
  } catch (error) {
    res.status(400).json({ message: 'Something went wrong', error: error.message })
  }
}

const findAllAdoptablePets = async (req, res) => {
  try {
    const allAdoptablePets = await Pet.find({ availableForAdoption: true })
    res.json({ pets: allAdoptablePets })
  } catch (error) {
    res.status(400).json({ message: 'Something went wrong', error: error.message })
  }
}

const uploadImageToCloudinary = async (imgBase64Array) => {
  try {
    // Map the base64 images to an array of upload promises
    const cloudinaryURLs = await Promise.all(
      imgBase64Array.map(async (imgBase64) => {
        try {
          return await uploadImage(imgBase64)
        } catch (error) {
          console.error(error)
          throw new Error('Image upload failed')
        }
      })
    )
    return cloudinaryURLs // Return an array of URLs from Cloudinary
  } catch (error) {
    console.error('Error in uploading images to Cloudinary:', error)
    throw error
  }
}

const createNewPet = async (req, res) => {
  const shelterId = req.shelterId // geting shelterId from jwt middelware
  const petData = { ...req.body, shelter: shelterId } // Crear los datos de la mascota con el `shelter`
  const imgBase64Array = petData.imgURL

  try {
    const cloudinaryURLs = process.env.MODE !== 'DEV' ? await uploadImageToCloudinary(imgBase64Array) : 'prueba'

    petData.imgURL = cloudinaryURLs // Assign the Cloudinary URLs to the pet data

    // Create the new pet
    const newlyCreatedPet = await Pet.create(petData)

    // Add the new pet's ID to the shelter's pets array using $push
    await Shelter.findByIdAndUpdate({ _id: shelterId }, { $push: { pets: newlyCreatedPet._id } }, { new: true })

    // Respond with the newly created pet's ID
    res.json({ pet: { id: newlyCreatedPet._id } })
  } catch (error) {
    res.status(400).json({ message: 'Something went wrong', error: error.message })
  }
}

const updateExistingPet = async (req, res) => {
  const { id } = req.params
  const hasImgBase64Array = req.body.imgURL?.length > 0

  try {
    if (hasImgBase64Array) {
      const imgBase64Array = req.body.imgURL
      const cloudinaryURLs = await uploadImageToCloudinary(imgBase64Array)
      req.body.imgURL = cloudinaryURLs // Assign the Cloudinary URLs to the pet data
    }

    const updatedPet = await Pet.findOneAndUpdate({ _id: id }, req.body, { new: true })

    res.json({ pet: updatedPet })
  } catch (error) {
    res.status(400).json({ message: 'Something went wrong', error: error.message })
  }
}

const deleteAnExistingPet = async (req, res) => {
  const { id } = req.params
  const shelterId = req.shelterId // geting shelterId from jwt middelware
  try {
    // Remove the pet ID from the shelter's pets array using $pull
    await Shelter.findByIdAndUpdate({ _id: shelterId }, { $pull: { pets: id } }, { new: true })

    // Delete the requests made for the pet to be deleted
    await Request.deleteMany({ pet: { _id: id } })

    // Delete the pet from the Pet collection
    const result = await Pet.deleteOne({ _id: id })

    // Return the result of the deletion
    res.json({ result })
  } catch (error) {
    res.status(400).json({ message: 'Something went wrong', error: error.message })
  }
}

export default {
  findAllPets,
  findPetsWithQuery,
  createNewPet,
  updateExistingPet,
  deleteAnExistingPet
}
