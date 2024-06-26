import { ModuleKind, Project, ScriptTarget } from 'ts-morph';

export function getTablesProperties(typesPath: string) {
  const project = new Project({
    compilerOptions: {
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      module: ModuleKind.ESNext,
      target: ScriptTarget.ESNext,
      strictNullChecks: true,
    },
  });

  const sourceFile = project.addSourceFileAtPath(typesPath);

  // Find the 'Tables' property within the 'Database' type alias
  const dbTypeAlias = sourceFile.getTypeAlias('Database');

  if (!dbTypeAlias) {
    throw new Error('No Database type alias found.');
  }

  const dbType = dbTypeAlias.getType();

  if (!dbType) {
    throw new Error('No Database type found.');
  }

  const publicType = dbType
    .getPropertyOrThrow('public')
    .getValueDeclarationOrThrow()
    .getType();

  const tablesType = publicType
    .getPropertyOrThrow('Tables')
    .getValueDeclarationOrThrow()
    .getType();

  const tablesProperties = tablesType.getProperties();

  if (tablesProperties.length === 0) {
    throw new Error('No tables found within the Tables property.');
  }

  return tablesProperties;
}
