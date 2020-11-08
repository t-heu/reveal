import { Schema, model, Document } from 'mongoose'
//const bcrypt = require('bcryptjs')

export interface UserDTO {
  _id: string
  password: string
  email: string
  name?: string
  role?: string
}

interface IUser extends Document {
  password: string
  email: string
  name?: string
  role?: string
}

const UserSchema = new Schema({
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'mod'
  },
  name: {
    type: String,
    default: ''
  },
}, {
  timestamps: true,
})

// UserSchema.pre('save', async function(next) {
//   console.log('a')
//   if(!await bcrypt.compare('', this.password)) {
//     console.log('b')
//     const hash = await bcrypt.hash(this.password, 8)
//     this.password = hash
//     next()
//   }
//   next()
// })

// UserSchema.virtual('thumbnail_url').get(function(this: UserDTO) {
//   return /(https|http?:\/\/[^\s]+)/g.test(this.thumbnail as string) ? this.thumbnail : `${process.env.APP_URL}/files/${this.thumbnail}`
//   //return `http://localhost:3000/files/${this.thumbnail}`
// })

export default model<IUser>('User', UserSchema);