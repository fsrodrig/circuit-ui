/**
 * Copyright 2020, SumUp Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Transform } from 'jscodeshift';

import { findLocalNames } from './utils';

const transform: Transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const components = findLocalNames(j, root, 'LoadingButton');

  if (!components) {
    return;
  }

  components.forEach((component) => {
    ['exitAnimation', 'exitAnimationDuration', 'onAnimationComplete'].forEach(
      (prop) => {
        root
          .findJSXElements(component)
          .find(j.JSXAttribute, {
            name: {
              type: 'JSXIdentifier',
              name: prop,
            },
          })
          .remove();
      },
    );
  });

  return root.toSource();
};

export default transform;
