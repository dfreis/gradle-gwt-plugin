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

import com.google.gwt.inject.client.AbstractGinModule;
import com.google.inject.Singleton;
import net.desource.samples.fortune.client.remote.SunnyFortuneService;
import net.desource.samples.fortune.client.remote.FortuneService;
import net.desource.samples.fortune.client.ui.FortuneTeller;
import net.desource.samples.fortune.client.ui.FortuneTellerView;

/**
 *
 */
public class AppModule extends AbstractGinModule {

    @Override
    protected void configure() {
        bind(App.class).in(Singleton.class);
        bind(FortuneTeller.class).to(FortuneTellerView.class).in(Singleton.class);
        bind(FortuneService.class).to(SunnyFortuneService.class).in(Singleton.class);
//        bind(FortuneService.class).to(RPCFortuneService.class).in(Singleton.class);
    }


}
