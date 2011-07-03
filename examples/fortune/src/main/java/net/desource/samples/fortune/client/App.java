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
package net.desource.samples.fortune.client;

import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.ui.HasWidgets;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import net.desource.samples.fortune.client.remote.FortuneService;
import net.desource.samples.fortune.client.ui.FortuneTeller;

/**
 *
 */
@Singleton
public class App implements FortuneTeller.Listener {

    private final FortuneService fortuneService;
    private final FortuneTeller fortuneTeller;

    @Inject
    public App(FortuneService fortuneService, FortuneTeller fortuneTeller) {
        this.fortuneService = fortuneService;
        this.fortuneTeller = fortuneTeller;
        fortuneTeller.setListener(this);
    }

    public void run(HasWidgets container) {
        container.add(fortuneTeller.asWidget());
    }

    public void revealFortune() {
        fortuneService.getFortune(new FortuneService.Callback() {
            public void onSuccess(Fortune fortune) {
                fortuneTeller.updateFortune(fortune);
            }
            public void onFailure(Throwable exception) {
                GWT.log("Failed to lookup fortune", exception);
                fortuneTeller.updateFortune(new Fortune("Future looks uncertain"));
            }
        });

    }
}
