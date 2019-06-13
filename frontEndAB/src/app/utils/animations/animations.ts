import { trigger, state, style, transition, animate, animateChild, query, stagger } from '@angular/animations';

export const onSideNavChange = trigger('onSideNavChange', [
  state('close',
    style({
      'min-width': '50px'
    })
  ),
  state('open',
    style({
      'min-width': '200px'
    })
  ),
  transition('close => open', animate('250ms ease-in')),
  transition('open => close', animate('250ms ease-in')),
]);


export const onMainContentChange = trigger('onMainContentChange', [
  state('close',
    style({
      'margin-left': '62px'
    })
  ),
  state('open',
    style({
      'margin-left': '200px'
    })
  ),
  transition('close => open', animate('250ms ease-in')),
  transition('open => close', animate('250ms ease-in')),
]);

export function fadeIn(selector = ':enter', duration = '400ms ease-out') {
  return [
    transition('* => *', [      
      query(selector, [
        style({ opacity: 0, transform: 'translateY(-5px)'}), 
        stagger('60ms', [
          animate(duration, style({
            opacity: 1,
            transform: 'translateY(0px)'
          }))
        ])
      ], {optional: true })
    ])
  ];
}

export function fadeOut(selector = ':leave', duration = 300) {
  return [
    transition('* => *', [
      query(selector, [
        style({ opacity: 1 }),
        stagger('30ms', [
          animate(duration, style({ 
            opacity: 0
          }))
        ])
      ], {optional: true })
    ])
  ];
}

export const animateText = trigger('animateText', [
  state('hide',
    style({
      'display': 'none',
      opacity: 0
    }),
  ),
  state('show',
    style({
      'display': 'block',
      opacity: 1
    })
  ),
  transition('close => open', animate('350ms ease-in')),
  transition('open => close', animate('200ms ease-out')),
]);