import React from 'react';
import ReactDOM from 'react-dom';
import { ReactFormBuilder } from 'react-form-builder2';
import DemoBar from './demobar';
import * as variables from './variables';

import $ from 'jquery';

import 'react-form-builder2/dist/app.css';

export default function Home() {
  return (
    <div>
      <DemoBar variables={variables} />
      <ReactFormBuilder variables={variables}
        url='/api/formdata'
        saveUrl='/api/formdata'
      />
    </div>
  )
}
