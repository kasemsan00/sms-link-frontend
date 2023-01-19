import Head from "next/head";
import useTranslation from "next-translate/useTranslation";

export default function LinkID() {
  const { t } = useTranslation("common");
  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta name="theme-color" content="#3A80DB" />
      </Head>
      <main></main>
    </>
  );
}
