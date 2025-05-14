
const AboutSection = () => {
  return (
    <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold text-fiscal-blue mb-4">Sobre esta ferramenta</h2>
      <p className="mb-4">
        Esta é uma aplicação web 100% frontend para auxiliar empresas e contadores na conversão de arquivos fiscais da EFD ICMS IPI (TXT ↔ Excel).
      </p>
      <p className="mb-4">
        A ferramenta permite carregar arquivos .txt no formato SPED, convertê-los para Excel de forma organizada, e reconvertê-los de volta para TXT com a estrutura preservada.
      </p>
      <p className="font-medium">
        Nenhum dado é enviado para servidores — todo o processamento ocorre no navegador, garantindo privacidade e agilidade.
      </p>
    </div>
  );
};

export default AboutSection;
