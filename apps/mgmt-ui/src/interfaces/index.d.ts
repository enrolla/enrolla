export interface IFeature {
  key: string;
  type: 'INTEGER' | 'FLOAT' | 'STRING' | 'BOOLEAN' | 'JSON';
  defaultValue: unknown;
  description: string;
  createdAt: string;
}
