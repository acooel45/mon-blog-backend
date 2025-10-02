import { Context } from 'koa';

export default async (policyContext: Context, config: any, { strapi }: any) => {
  const { id } = policyContext.params;
  const user = policyContext.state.user;

  if (!user) {
    return policyContext.unauthorized('Vous devez être connecté.');
  }

  // Récupérer l'article avec son auteur via le Document Service API (v5)
  const entity = await strapi.documents('api::article.article').findOne({id: id, populate: "author"});

  if (!entity || !entity.author || entity.author.id !== user.id) {
    return policyContext.unauthorized(
      'Vous ne pouvez modifier ou supprimer que vos propres articles.'
    );
  }

  return true;
};




