export function html(params: { userName: string }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1>Bienvenue chez Writewave Pro, ${params.userName} !</h1>
      <p>Merci d'avoir souscrit à notre plan premium.</p>
      <p>Tu as maintenant accès à toutes les fonctionnalités.</p>
      <p>Pour commencer, connecte-toi et découvre tout ce que tu peux faire.</p>
      <br/>
      <p>Bonne écriture !</p>
      <p>L’équipe Writewave</p>
    </div>
  `;
}

export function text(params: { userName: string }) {
  return `
Bienvenue chez Writewave Pro, ${params.userName} !

Merci d'avoir souscrit à notre plan premium.

Tu as maintenant accès à toutes les fonctionnalités.

Pour commencer, connecte-toi et découvre tout ce que tu peux faire.

Bonne écriture !

L’équipe Writewave
  `.trim();
}
