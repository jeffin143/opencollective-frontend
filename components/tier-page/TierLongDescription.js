import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { FormattedMessage } from 'react-intl';

import StyledButton from '../StyledButton';
import InlineEditField from '../InlineEditField';
import LoadingPlaceholder from '../LoadingPlaceholder';
import HTMLContent, { isEmptyValue } from '../HTMLContent';

// Dynamicly load heavy inputs only if user can edit the page
const HTMLEditorLoadingPlaceholder = () => <LoadingPlaceholder height={400} />;
const HTMLEditor = dynamic(() => import(/* webpackChunkName: 'HTMLEditor' */ '../HTMLEditor'), {
  loading: HTMLEditorLoadingPlaceholder,
  ssr: false,
});

/**
 * Displays the tier long description on the page, with an optional form to edit it
 * if user is allowed to do so.
 */
const TierLongDescription = ({ tier, editMutation, canEdit }) => {
  return (
    <InlineEditField mutation={editMutation} values={tier} field="longDescription" canEdit={canEdit}>
      {({ isEditing, value, setValue, enableEditor }) => {
        if (isEditing) {
          return (
            <HTMLContent>
              <HTMLEditor defaultValue={value} onChange={setValue} allowedHeaders={[false, 2, 3]} /** Disable H1 */ />
            </HTMLContent>
          );
        } else if (isEmptyValue(tier.longDescription)) {
          return !canEdit ? null : (
            <StyledButton buttonSize="large" onClick={enableEditor} data-cy="Btn-Add-longDescription">
              <FormattedMessage id="TierPage.AddLongDescription" defaultMessage="Add a rich description" />
            </StyledButton>
          );
        } else {
          return <HTMLContent content={tier.longDescription} data-cy="longDescription" />;
        }
      }}
    </InlineEditField>
  );
};

TierLongDescription.propTypes = {
  tier: PropTypes.shape({
    id: PropTypes.number.isRequired,
    longDescription: PropTypes.string,
  }).isRequired,
  editMutation: PropTypes.object,
  canEdit: PropTypes.bool,
};

export default TierLongDescription;
