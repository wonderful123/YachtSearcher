import Transform from '@ember-data/serializer/transform';
import config from '../config/environment';

export default class ImageUrlTransform extends Transform {
  deserialize(images) {
    const baseUrl = config.image_server;

    if (Array.isArray(images)) {
      return images.map(imageUrl => baseUrl + imageUrl);
    } else {
      return baseUrl + images;
    }
  }

  serialize(deserialized) {
    return deserialized;
  }
}
