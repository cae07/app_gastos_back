// Função utilitária para converter _id em id e remover __v
export function toClient(doc: any): any {
  if (Array.isArray(doc)) {
    return doc.map(toClient);
  }
  if (doc && typeof doc.toObject === 'function') {
    doc = doc.toObject();
  }
  if (doc && typeof doc === 'object') {
    const { _id, __v, ...rest } = doc;
    return { id: _id?.toString?.() ?? _id, ...rest };
  }
  return doc;
}
