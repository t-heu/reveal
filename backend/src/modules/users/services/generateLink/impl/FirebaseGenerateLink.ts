import axios from 'axios';
import { IGenerateLink } from '../models/generateLink';

export class FirebaseGenerateLink implements IGenerateLink {
  async generateDynamicLink(url: string): Promise<string> {
    try {
      const response = await axios.post(
        `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.FIREBASE_API_KEY}`,
        {
          longDynamicLink: `https://revealapp.page.link/?link=${url}&apn=com.reveal.reveal&ibi=com.example.ios`,
        },
      );

      return response.data.shortLink;
    } catch (err) {
      return err;
    }
  }
}
