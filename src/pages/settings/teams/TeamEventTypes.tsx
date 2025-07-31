
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const TeamEventTypes = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to main event types page with team selected
    navigate(`/?team=${teamId}`, { replace: true });
  }, [teamId, navigate]);

  return null;
};
