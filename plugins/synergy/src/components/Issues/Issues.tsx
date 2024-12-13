import React, { useEffect, useState } from 'react';
import {
  InfoCard,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { ProjectIssue } from '@opensource-sig/backstage-plugin-synergy-common';
import { useSynergyApi } from '../../hooks';
import { Box, Grid } from '@material-ui/core';
import { Dropdown } from '../UI';
import FilterListIcon from '@material-ui/icons/FilterList';
import { IssuesList } from '../IssuesList';
import { InfoBanner } from '../InfoBanner';

export const Issues = () => {
  const {
    value: issuesList,
    loading,
    error,
  } = useSynergyApi(api => api.getIssues());

  const [issues, setIssues] = useState<ProjectIssue[]>([]);
  const [pinnedIssues, setPinnedIssues] = useState<ProjectIssue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<ProjectIssue[]>([]);
  const [filteredPinnedIssues, setFilteredPinnedIssues] = useState<
    ProjectIssue[]
  >([]);
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    if (issuesList) {
      const open: ProjectIssue[] = [];
      const pinned: ProjectIssue[] = [];
      issuesList.forEach((issue: ProjectIssue) => {
        if (issue.isPinned) {
          pinned.push(issue);
        } else {
          open.push(issue);
        }
      });
      setIssues(open);
      setPinnedIssues(pinned);
      setFilteredIssues(open);
      setFilteredPinnedIssues(pinned);
    }
  }, [issuesList]);

  const prepareCategories = (projectsIssues?: ProjectIssue[]) => {
    if (!projectsIssues) return [];

    const categories = new Set<string>();

    projectsIssues.forEach((issue: ProjectIssue) => {
      if (issue.primaryLanguage) {
        categories.add(issue.primaryLanguage);
      }
    });

    return [...categories];
  };

  const filterByCategory = (e: React.ChangeEvent<{ value: unknown }>) => {
    if (issuesList) {
      const currentCategory = e.target.value as string;
      if (currentCategory) {
        const filteredOpen = issues.filter(
          (issue: ProjectIssue) => issue.primaryLanguage === currentCategory,
        );
        const filteredPinned = pinnedIssues.filter(
          (issue: ProjectIssue) => issue.primaryLanguage === currentCategory,
        );
        setFilteredIssues(filteredOpen);
        setFilteredPinnedIssues(filteredPinned);
      } else {
        setFilteredIssues(issues);
        setFilteredPinnedIssues(pinnedIssues);
      }
      setCategory(currentCategory);
    }
  };

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <InfoBanner
          title="Explore inner-source issues from projects in your org which are not exclusively inner-source"
          subtitle="Issues below aren’t limited to inner-source projects—any project can request contributions from the inner-source community."
        />
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gridGap: '8px',
            justifySelf: 'right',
            width: '200px',
            marginTop: '-10px',
          }}
        >
          <FilterListIcon fontSize="medium" style={{ marginTop: '20px' }} />
          <Dropdown
            label="Category"
            items={prepareCategories(issuesList)}
            current={category}
            handleSelect={filterByCategory}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoCard
          title="Pinned Issues"
          subheader="Pinned issues across repos in your org"
        >
          {filteredPinnedIssues.length ? (
            <IssuesList issues={filteredPinnedIssues} />
          ) : (
            <p>No Pinned Inner-Source issues found.</p>
          )}
        </InfoCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoCard
          title="Other Issues"
          subheader="Issues across repos in your org (excluding pinned)"
        >
          {filteredIssues.length ? (
            <IssuesList issues={filteredIssues} />
          ) : (
            <p>No Inner-Source issues found.</p>
          )}
        </InfoCard>
      </Grid>
    </Grid>
  );
};
