/*************************************************************
 *  Copyright (c) 2019 American Mathematical Society
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

MathJax.Extension['TeX/mathtools'] = {
  version: '1.0.0'
};

MathJax.Hub.Register.StartupHook('TeX AMSmath Ready', function() {
  var TEX = MathJax.InputJax.TeX;
  TEX.Definitions.Add({
    macros: {
      coloneqq: ['Macro', '\\mathrel{≔}']
    },
    environment: {
      'bmatrix*': ['Array', 'bmatrix*', '[', ']'],
      dcases: ['Array', null, '\\{', '.', 'll', null, '.2em', 'D'],
      bsmallmatrix: ['Array', null, '[', ']', 'c', '0.333em', '.2em', 'S', 1]
    }
  });
  MathJax.Hub.Startup.signal.Post('TeX mathtools Ready');
});

MathJax.Callback.Queue([
  'loadComplete',
  MathJax.Ajax,
  '[mathtools]/mathtools.js'
]);
