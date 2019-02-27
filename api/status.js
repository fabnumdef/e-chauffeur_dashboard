import StateMachine from 'javascript-state-machine';

export const CREATED = 'created';
export const VALIDATED = 'validated'; // Regulation validation
export const REJECTED_BOUNDARY = 'rejected_boundary'; // Regulation validation
export const REJECTED_CAPACITY = 'rejected_capacity'; // Regulation validation
export const ACCEPTED = 'accepted'; // Driver acceptance
export const DECLINED = 'declined'; // Driver rejection
export const STARTED = 'started';
export const WAITING = 'waiting';
export const IN_PROGRESS = 'progress';
export const DELIVERED = 'delivered';
export const DONE = 'done';
export const CANCELED = 'canceled';
export const CANCELED_TECHNICAL = 'canceled_technical';
export const CANCELED_REQUESTED_CUSTOMER = 'canceled_requested_customer';
export const CANCELED_CUSTOMER_OVERLOAD = 'canceled_customer_overload';
export const CANCELED_CUSTOMER_MISSING = 'canceled_customer_missing';

export const VALIDATE = 'validation';
export const REJECT_BOUNDARY = 'rejection_boundary';
export const REJECT_CAPACITY = 'rejection_capacity';
export const ACCEPT = 'accept';
export const DECLINE = 'decline';
export const START = 'start-up';
export const WAIT = 'stay';
export const PROGRESS = 'progress';
export const DELIVER = 'deliver';
export const FINISH = 'finish';
export const CANCEL = 'void';
export const CANCEL_TECHNICAL = 'cancel_technical';
export const CANCEL_REQUESTED_CUSTOMER = 'cancel_requested_by_customer';
export const CANCEL_CUSTOMER_OVERLOAD = 'cancel_customer_overload';
export const CANCEL_CUSTOMER_MISSING = 'cancel_customer_missing';

const CANCELABLE = [ACCEPTED, STARTED, WAITING, IN_PROGRESS, DELIVERED];

export default (init = CREATED) => new StateMachine({
  init,
  transitions: [
    { name: VALIDATE, from: CREATED, to: VALIDATED },
    { name: REJECT_BOUNDARY, from: CREATED, to: REJECTED_BOUNDARY },
    { name: REJECT_CAPACITY, from: CREATED, to: REJECTED_CAPACITY },
    { name: ACCEPT, from: VALIDATED, to: ACCEPTED },
    { name: DECLINE, from: VALIDATED, to: DECLINED },
    { name: START, from: ACCEPTED, to: STARTED },
    { name: WAIT, from: STARTED, to: WAITING },
    { name: PROGRESS, from: WAITING, to: IN_PROGRESS },
    { name: DELIVER, from: IN_PROGRESS, to: DELIVERED },
    { name: FINISH, from: DELIVERED, to: DONE },
    { name: CANCEL, from: CANCELABLE, to: CANCELED },
    { name: CANCEL_TECHNICAL, from: CANCELABLE, to: CANCELED_TECHNICAL },
    { name: CANCEL_REQUESTED_CUSTOMER, from: CANCELABLE, to: CANCELED_REQUESTED_CUSTOMER },
    { name: CANCEL_CUSTOMER_OVERLOAD, from: CANCELABLE, to: CANCELED_CUSTOMER_OVERLOAD },
    { name: CANCEL_CUSTOMER_MISSING, from: CANCELABLE, to: CANCELED_CUSTOMER_MISSING },
  ],
});
