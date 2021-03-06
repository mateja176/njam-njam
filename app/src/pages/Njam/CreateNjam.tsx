import { Button, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import { any, isEmpty } from 'ramda';
import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { Box } from 'rebass';
import { Err, FormContainer, Retry } from '../../components';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useCreateNjamMutation, useUsersQuery } from '../../generated/graphql';
import { NjamFormValues, routeName, routePath } from '../../models';
import { formValuesToNjam, useUserId } from '../../utils';
import NjamForm from './NjamForm';

export interface CreateNjamProps
  extends FormComponentProps<NjamFormValues>,
    RouteComponentProps {}

const CreateNjam: React.FC<CreateNjamProps> = ({ form }) => {
  const userId = useUserId();

  const disabled =
    !form.isFieldsTouched() ||
    any(Boolean)(Object.values(form.getFieldsError()));

  const [createNjam, { data, loading, error }] = useCreateNjamMutation();

  const usersQueryResult = useUsersQuery();

  const { data: { users } = { users: [] } } = usersQueryResult;

  const usersNotLoaded = isEmpty(users);

  return (
    <FormContainer>
      {usersQueryResult.loading && <LoadingOverlay />}
      {usersQueryResult.error && (
        <Box mb={3}>
          <Retry
            error={usersQueryResult.error}
            refetch={usersQueryResult.refetch}
          >
            Reload Users
          </Retry>
        </Box>
      )}
      <NjamForm
        readOnly={usersNotLoaded}
        initialValues={{
          location: '',
          ordered: false,
          time: moment().add(1, 'hour'),
          organizerId: usersNotLoaded ? '' : userId,
          participantIds: [],
          description: '',
        }}
        form={form}
        users={users}
        userId={userId}
        hideOrdered
      />
      <Button
        loading={loading}
        disabled={disabled}
        onClick={() => {
          form.validateFieldsAndScroll((error, values) => {
            if (!error) {
              const variables = formValuesToNjam(userId)(values);

              createNjam({ variables });
            }
          });
        }}
      >
        Create Njam
      </Button>
      {error && (
        <Box mt={3}>
          <Err {...error} />
        </Box>
      )}
      {data && <Redirect to={routePath.njams} />}
    </FormContainer>
  );
};

export default Form.create<CreateNjamProps>({ name: routeName.createNjam })(
  CreateNjam,
);
