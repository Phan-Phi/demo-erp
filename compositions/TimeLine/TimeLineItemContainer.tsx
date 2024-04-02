import { useMemo } from "react";
import { useRouter } from "next/router";
import { Box, Button, styled } from "@mui/material";

import TimeLineItemContent from "./TimeLineItemContent";

import { useFetch, usePermission, useUser } from "hooks";
import { transformUrl } from "libs";
import { Container, LoadingDynamic } from "components";

import { ISSUE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_ISSUES_END_POINT } from "__generated__/END_POINT";

export default function TimeLineItemContainer() {
  const router = useRouter();
  const { id: idOfUser } = useUser();

  const { hasPermission: readPermission } = usePermission("read_issue");

  const { data } = useFetch<ISSUE_VIEW_TYPE_V1>(
    transformUrl(ADMIN_ISSUES_END_POINT, {
      no_parent: false,
      parent: router.query.idx,
    })
  );

  const render = useMemo(() => {
    if (data == undefined) return <LoadingDynamic />;

    const filterIssuesComment = data.filter((el: any) => el.owner.id === idOfUser);

    if (readPermission) {
      return data.map((el: any, idx: number) => {
        return (
          <TimeLineItemContent
            id={el.id}
            key={idx}
            disableTimeLine={idx + 1 === data.length}
          />
        );
      });
    }
    return filterIssuesComment.map((el: any, idx: number) => {
      return (
        <TimeLineItemContent
          id={el.id}
          key={idx}
          disableTimeLine={idx + 1 === filterIssuesComment.length}
        />
      );
    });
  }, [data]);

  return (
    <Box>
      {render}

      <StyledContainerButton>
        <Button
          onClick={() => {
            router.push("/issues/create?type=comment");
          }}
        >
          Bình luận
        </Button>
      </StyledContainerButton>
    </Box>
  );
}

const StyledContainerButton = styled(Container)(() => {
  return {
    textAlign: "right",
  };
});
