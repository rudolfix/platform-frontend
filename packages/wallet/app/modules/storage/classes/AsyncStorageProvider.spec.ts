import { AsyncStorageProvider } from "./AsyncStorageProvider";

describe("AsyncStorageProvider", () => {
  let provider: AsyncStorageProvider;
  const key = "test";
  const batman = "Batman";
  const wonderWoman = "Wonder Woman";

  beforeEach(async () => {
    provider = new AsyncStorageProvider();
    await provider.clear();
  });

  it("should save data by key", async () => {
    await provider.setItem(key, batman);
    const saved = await provider.getItem(key);
    expect(saved).toBe(batman);
  });

  it("should for falsy value", async () => {
    await provider.setItem(key, batman);
    const saved = await provider.getItem(key);
    expect(saved).not.toBe(wonderWoman);
  });

  it("should remove data", async () => {
    await provider.setItem(key, batman);
    const saved = await provider.getItem(key);
    expect(saved).toBe(batman);
    await provider.removeItem(key);
    const removed = await provider.getItem(key);
    expect(removed).toBeNull();
  });
});
