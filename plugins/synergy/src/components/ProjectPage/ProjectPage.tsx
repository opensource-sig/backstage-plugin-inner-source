import React from 'react';
import { useSynergyApi } from '../../hooks';
import {
  CardTab,
  InfoCard,
  Link,
  LinkButton,
  MarkdownContent,
  Progress,
  ResponseErrorPanel,
  TabbedCard,
} from '@backstage/core-components';
import { Box, Grid } from '@material-ui/core';
import { ProjectCard } from '../ProjectCard';
import {
  configApiRef,
  useApi,
  useRouteRefParams,
} from '@backstage/core-plugin-api';
import { projectRouteRef } from '../../routes';
import { IssuesList } from '../IssuesList';
import { ProjectIssue } from '@opensource-sig/backstage-plugin-synergy-common';
import { TabContent } from '../../utils';

type TabsContentProps = {
  content?: string;
  message: string;
};

type IssuesTabsContentProps = {
  issues?: ProjectIssue[];
  message: string;
};

const IssuesComponent = ({ issues, message }: IssuesTabsContentProps) => {
  return issues?.length ? <IssuesList issues={issues} /> : <p>{message}</p>;
};

const MarkdownComponent = ({ content, message }: TabsContentProps) => {
  return content ? (
    <MarkdownContent content={content} dialect="gfm" />
  ) : (
    <p>{message}</p>
  );
};

export const ProjectPage = () => {
  const tabStyles = {
    fontSize: '14px',
    padding: '18px 8px 13px ',
    whiteSpace: 'nowrap',
  };
  const config = useApi(configApiRef);
  const hideIssues = config.getOptionalBoolean(
    'synergy.provider.github.hideIssues',
  );
  const { owner, project } = useRouteRefParams(projectRouteRef);
  const {
    value: projectData,
    loading,
    error,
  } = useSynergyApi(api => api.getProject(project, owner));

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const issueTabs: TabContent[] = [
    {
      label: 'Pinned Issues',
      style: tabStyles,
      children: (
        <IssuesComponent
          issues={projectData?.pinnedIssues}
          message="No Pinned Issues found for this project."
        />
      ),
    },
    {
      label: 'All Issues',
      style: tabStyles,
      children: (
        <IssuesComponent
          issues={projectData?.issues}
          message="No Open Issues found for this project."
        />
      ),
    },
  ];

  const otherTabs: TabContent[] = [
    {
      label: 'README',
      style: tabStyles,
      children: (
        <MarkdownComponent
          content={projectData?.readme}
          message="README file not found."
        />
      ),
    },
    {
      label: 'Contributing Guidelines',
      style: tabStyles,
      children: (
        <MarkdownComponent
          content={projectData?.contributingGuidelines}
          message="No contribution guideline found."
        />
      ),
    },
  ];

  const allTabs = (hideIssues ? [] : issueTabs).concat(otherTabs);

  return (
    projectData && (
      <InfoCard
        title="Project Details"
        subheader="Explore the project's open issues and start contributing."
      >
        <Box sx={{ mx: '.25rem', mb: '.25rem' }}>
          <Grid container spacing={2} justifyContent="flex-start">
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'centre',
                }}
              >
                <div>
                  <Link to="/synergy">Projects</Link> /{' '}
                  <span>{projectData.name}</span>
                </div>

                <LinkButton to="/synergy" variant="contained">
                  Back to All Projects
                </LinkButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={5}>
              <ProjectCard project={projectData} hideMore />
            </Grid>
            <Grid item md={6} lg={7}>
              <TabbedCard>
                {allTabs.map(tab => (
                  <CardTab label={tab.label} style={tab.style}>
                    {tab.children}
                  </CardTab>
                ))}
              </TabbedCard>
            </Grid>
          </Grid>
        </Box>
      </InfoCard>
    )
  );
};
