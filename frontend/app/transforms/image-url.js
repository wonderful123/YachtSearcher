import Transform from '@ember-data/serializer/transform';
import config from '../config/environment';

export default class ImageUrlTransform extends Transform {
  deserialize(images) {
    const baseUrl = config.image_server;

    return images.map(imageUrl => baseUrl + imageUrl)
  }

  serialize(deserialized) {
    return deserialized;
  }
}
