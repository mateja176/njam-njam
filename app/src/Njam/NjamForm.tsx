import { Form, Input, Select, Switch, TimePicker } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import React from 'react';
import { NjamFormValues, Users } from '../models';

export interface NjamFormProps extends FormComponentProps {
  initialValues: NjamFormValues;
  readOnly?: boolean;
  users: Users;
}

const NjamForm: React.FC<NjamFormProps> = ({
  readOnly = false,
  form,
  initialValues: {
    location,
    time,
    description,
    organizerId,
    participantIds,
    ordered,
  },
  users,
}) => {
  const readOnlyStyle: React.CSSProperties = {
    pointerEvents: readOnly ? 'none' : 'initial',
  };

  const usersOptions = users.map(({ id, name, lastname }) => (
    <Select.Option key={id} value={id}>
      {name} {lastname}
    </Select.Option>
  ));

  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
      }}
      hideRequiredMark={readOnly}
    >
      <Form.Item label="Location">
        {form.getFieldDecorator('location', {
          initialValue: location,
          rules: [{ required: true }],
        })(<Input readOnly={readOnly} />)}
      </Form.Item>
      <Form.Item label="Time">
        {form.getFieldDecorator('time', {
          initialValue: moment(time),
          rules: [
            {
              required: true,
              type: 'object',
            },
          ],
        })(<TimePicker inputReadOnly style={readOnlyStyle} format="hh:mm" />)}
      </Form.Item>
      <Form.Item label="Ordered">
        {form.getFieldDecorator('ordered', {
          initialValue: ordered,
          rules: [{ type: 'boolean' }],
        })(<Switch style={readOnlyStyle} />)}
      </Form.Item>
      <Form.Item label="Description">
        {form.getFieldDecorator('description', {
          initialValue: description,
        })(<Input.TextArea readOnly={readOnly} />)}
      </Form.Item>
      <Form.Item label="Invite friends">
        {form.getFieldDecorator('participants', {
          initialValue: participantIds,
        })(
          <Select mode="multiple" style={readOnlyStyle}>
            {usersOptions}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="Organizer">
        {form.getFieldDecorator('organizer', {
          initialValue: organizerId,
        })(<Select style={readOnlyStyle}>{usersOptions}</Select>)}
      </Form.Item>
    </Form>
  );
};
export default NjamForm;
