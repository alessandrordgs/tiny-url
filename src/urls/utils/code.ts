import ShortUniqueId from 'short-unique-id';
class Code {
  static generate() {
    const { randomUUID } = new ShortUniqueId({ length: 6 });
    return randomUUID();
  }
}

export default Code;
