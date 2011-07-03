/*
   Copyright 2010 Distinctive Edge Ltd

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */
package net.desource.samples.fortune.client.remote;

import com.google.gwt.user.client.Timer;
import net.desource.samples.fortune.client.Fortune;

/**
 *
 */
public class SunnyFortuneService implements FortuneService {

    private boolean first = true;

    public void getFortune(final Callback callback) {
        new Timer() {
            @Override
            public void run() {
                if( first ) {
                    first = false;
                    callback.onSuccess(new Fortune("The future looks bright"));
                } else {
                    callback.onSuccess(new Fortune("The future still looks bright"));
                }
            }
        }.schedule(1000);
    }

}
