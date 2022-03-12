import UserController from "./UserController";
import { startSession } from "mongoose";

test("Test that updateDefaultsIfNeeded fills in null fields", async () => {
  let saveCount = 0;

  const fakeUser = {
    username: null,
    avatarUrl: null,
    save: async () => {
      saveCount += 1;
      return Promise.resolve();
    },
  };
  const fakeProfile = {
    username: "hello",
    photos: [{ value: "http://example.com" }],
  };
  const fakeUserModel = {
    findOne: async () => Promise.resolve(null),
  };

  const userController = new UserController(fakeUserModel as any, () =>
    startSession()
  );
  const updatedUser = await userController.updateDefaultsIfNeeded(
    fakeUser as any,
    fakeProfile
  );

  expect(updatedUser.username).toBe("hello");
  expect(updatedUser.avatarUrl).toBe("http://example.com");
  expect(saveCount).toBe(1);
});

test("Test that updateDefaultsIfNeeded does not modify non-null fields", async () => {
  let saveCount = 0;

  const fakeUser = {
    username: "existing",
    avatarUrl: "http://alreadyhere.com",
    save: async () => {
      saveCount += 1;
      return Promise.resolve();
    },
  };
  const fakeProfile = {
    username: "hello",
    photos: [{ value: "http://example.com" }],
  };
  const fakeUserModel = {
    findOne: async () => Promise.resolve(null),
  };

  const userController = new UserController(fakeUserModel as any, () =>
    startSession()
  );
  const updatedUser = await userController.updateDefaultsIfNeeded(
    fakeUser as any,
    fakeProfile
  );

  expect(updatedUser.username).toBe("existing");
  expect(updatedUser.avatarUrl).toBe("http://alreadyhere.com");
  expect(saveCount).toBe(0);
});

test("Test that updateDefaultsIfNeeded does not exceed maximum retries", async () => {
  let saveCount = 0;
  let findOneCount = 0;

  const fakeUser = {
    username: null,
    avatarUrl: null,
    save: async () => {
      saveCount += 1;
      return Promise.resolve();
    },
  };
  const fakeProfile = {
    username: "hello",
    photos: [{ value: "http://example.com" }],
  };
  const fakeUserModel = {
    // Return empty object to fake existing user
    findOne: async () => {
      findOneCount += 1;
      return Promise.resolve({});
    },
  };

  const userController = new UserController(fakeUserModel as any, () =>
    startSession()
  );
  try {
    await userController.updateDefaultsIfNeeded(fakeUser as any, fakeProfile);
  } catch (err) {
    // Expect an error thrown.
    expect(err).toBeDefined();
  }

  expect(saveCount).toBe(0);
  expect(findOneCount).toBe(5); // 5 is maximum retries.
});
