import Head from "next/head";
import useTranslation from "next-translate/useTranslation";

export default function Home() {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <link rel="icon" type="image/x-icon" href="../favicon.png" />
      </Head>
      <main className="h-screen w-screen"></main>
    </>
  );
}
