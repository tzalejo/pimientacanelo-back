// Mock de las funciones de BaseEntity de TypeORM
jest.mock('typeorm', () => {
  const originalModule = jest.requireActual('typeorm');
  return {
    ...originalModule,
    BaseEntity: class MockBaseEntity {
      static find = jest.fn();
      static findOne = jest.fn();
      static findOneBy = jest.fn();
      static delete = jest.fn();
      save = jest.fn();
    },
  };
});
