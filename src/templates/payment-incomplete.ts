export function html(params: { userName: string, paymentUrl: string }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1>Conserver votre abonement, ${params.userName} !</h1>
      <p>Mettez à jour votre <a href="${params.paymentUrl}">abonnement</a><p>
      <br/>
      <p>Bonne écriture !</p>
      <p>L’équipe Writewave</p>
    </div>
  `;
}

export function text(params: { userName: string, paymentUrl: string }) {
  return `
Mettez à jour votre abonnement ${params.userName}.

Payment URL: ${params.paymentUrl}

L’équipe Writewave
  `.trim();
}
