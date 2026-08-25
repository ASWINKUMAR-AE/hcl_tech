import React, { createContext, useContext, useState, useEffect } from 'react';
import { pathAPI, recommendationAPI, skillGapAPI, progressAPI } from '../services/api';
import { useAuth } from './AuthContext';

const PathContext = createContext();

export const PathProvider = ({ children }) => {
  const { user } = useAuth();
  const [activePath, setActivePath] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [skillGap, setSkillGap] = useState(null);
  const [progressMetrics, setProgressMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadPathData();
    }
  }, [user]);

  const loadPathData = async () => {
    try {
      setLoading(true);
      const [pathRes, recRes, gapRes, metricsRes] = await Promise.all([
        pathAPI.getActive(),
        recommendationAPI.getRecommendations(),
        skillGapAPI.getSkillGap(),
        progressAPI.getMetrics(),
      ]);

      if (pathRes.data.success) setActivePath(pathRes.data.data);
      if (recRes.data.success) setRecommendations(recRes.data.data);
      if (gapRes.data.success) setSkillGap(gapRes.data.data);
      if (metricsRes.data.success) setProgressMetrics(metricsRes.data.data);
    } catch (err) {
      console.error('Failed to load path data:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateNewPath = async (goal) => {
    try {
      setLoading(true);
      const res = await pathAPI.generate(goal);
      if (res.data.success) {
        setActivePath(res.data.data);
        await loadPathData();
        return res.data.data;
      }
    } catch (err) {
      console.error('Failed to generate path:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStepStatus = async (stepId, status) => {
    try {
      const res = await pathAPI.updateStep(stepId, status);
      if (res.data.success) {
        await loadPathData();
      }
    } catch (err) {
      console.error('Failed to update step:', err);
    }
  };

  return (
    <PathContext.Provider value={{
      activePath,
      recommendations,
      skillGap,
      progressMetrics,
      loading,
      loadPathData,
      generateNewPath,
      updateStepStatus,
    }}>
      {children}
    </PathContext.Provider>
  );
};

export const usePath = () => useContext(PathContext);
