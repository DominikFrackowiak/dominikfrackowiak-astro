---
title: React-PDF con Next.js
lang: es
key: react-pdf-with-next-js
description: Cómo generar, previsualizar y descargar archivos PDF dinámicos en una aplicación Next.js con React-PDF.
slug: react-pdf-with-next-js
tags:
  - Next.js
  - React-PDF
  - React.js
---

# React-PDF con Next.js

Hace unos meses me pidieron en el trabajo crear un PDF en un proyecto con React y Next.js. El archivo tenía que generarse dinámicamente después de una compra e incluir un número único recibido desde el backend como justificante de la transacción. La tarea parecía sencilla: después de investigar un poco, elegí `@react-pdf/renderer`. Entonces aparecieron los primeros problemas. Si te encuentras con algo parecido, este artículo debería ayudarte con la configuración.

## Instalación

Instala el paquete:

```bash
npm install @react-pdf/renderer
```

Si `npm` muestra conflictos de peer dependencies en tu proyecto, instálalo con `--legacy-peer-deps`:

```bash
npm install @react-pdf/renderer --save --legacy-peer-deps
```

Los elementos básicos para construir un documento PDF son `Document`, `Page`, `View`, `Text` e `Image`. También puedes importar utilidades como `PDFViewer`, `PDFDownloadLink`, `StyleSheet` y `Font`:

```tsx
import {
  Document,
  Page,
  View,
  Text,
  Image,
  PDFViewer,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
```

Estos son los bloques principales del PDF. `View` funciona de forma parecida a un `div`, pero recuerda que React-PDF no renderiza elementos HTML normales dentro del documento.

Las fuentes que quieras usar en el PDF deben registrarse primero:

```tsx
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/assets/fonts/Roboto-Regular.ttf', fontWeight: 400 },
    { src: '/assets/fonts/Roboto-Medium.ttf', fontWeight: 500 },
    { src: '/assets/fonts/Roboto-Bold.ttf', fontWeight: 700 },
  ],
});
```

## Estructura del documento

La estructura del documento puede verse así:

```tsx
const PDF = () => {
  return (
    <Document>
      <Page>
        <View>
          <Text>Contenido del documento</Text>
        </View>
      </Page>
    </Document>
  );
};
```

Como he mencionado antes, `View` es el equivalente a un contenedor. Puedes crear tantos elementos `View` como necesites y anidarlos según el layout del documento.

## Estilos

Puedes aplicar estilos inline:

```tsx
<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
  <Text>Contenido</Text>
</View>
```

Conviene definir `flexDirection` de forma explícita. En el CSS del navegador, el valor por defecto de `flex-direction` es `row`, pero el layout de React-PDF se comporta de otra manera, así que los valores explícitos hacen que el resultado sea más predecible.

La segunda opción, más limpia, es `StyleSheet.create`:

```tsx
const styles = StyleSheet.create({
  imageWrapper: {
    marginLeft: 20,
  },
});

<View style={styles.imageWrapper}>
  <Image src="/assets/example.png" />
</View>;
```

## PDF en la página

Para mostrar el PDF en una página, exporta un componente con `PDFViewer` desde el archivo donde creas el documento:

```tsx
const PDFView = () => {
  return (
    <PDFViewer>
      <PDF />
    </PDFViewer>
  );
};

export default PDFView;
```

Después importa ese componente de forma dinámica en la página donde se debe mostrar el PDF:

```tsx
'use client';

import dynamic from 'next/dynamic';

const InvoicePDF = dynamic(() => import('./pdf'), {
  ssr: false,
});
```

La opción `ssr: false` es importante en Next.js. React-PDF necesita APIs disponibles en el navegador, así que el viewer debe renderizarse en el lado del cliente.

Luego puedes usar `InvoicePDF` como cualquier otro componente de React:

```tsx
export default function PDFPage() {
  return (
    <div className={styles.pdfWrapper}>
      <InvoicePDF locale={locale} />
    </div>
  );
}
```

## Botón para descargar el PDF

Si quieres añadir un botón de descarga en lugar de la vista previa del PDF, o junto a ella, importa también `PDFDownloadLink` de forma dinámica:

```tsx
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);
```

Después envuelve tu botón con `PDFDownloadLink`:

```tsx
<PDFDownloadLink
  document={<PDF locale={locale} />}
  fileName={`DominikFrackowiak_CV_${locale}.pdf`}
>
  <button className={className}>{handleTranslation(locale)}</button>
</PDFDownloadLink>
```

Y listo.
