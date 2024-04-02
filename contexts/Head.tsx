import NextHead from "next/head";
import { Fragment } from "react";
import { NextSeo } from "next-seo";

import { useSetting } from "hooks";

const Head = () => {
  const { company_name, logo } = useSetting();
  const title = company_name ? `ERP - ${company_name || ""}` : "ERP";

  return (
    <Fragment>
      <NextSeo
        title={title}
        additionalLinkTags={[
          { rel: "shortcut icon", type: "image/x-icon", href: logo?.default || "" },
        ]}
      />
      <NextHead>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        {process.env.NODE_ENV === "production" && (
          <meta
            httpEquiv="Content-Security-Policy"
            content="upgrade-insecure-requests"
          ></meta>
        )}
      </NextHead>
    </Fragment>
  );
};

export default Head;
