export class Random {
  async createRandomValue(): Promise<string> {
    var RandomValue = Math.random().toString(36).slice(2);
    return RandomValue;
  }
}
