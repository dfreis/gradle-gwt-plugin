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

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.inject.client.GinModules;
import com.google.gwt.inject.client.Ginjector;
import com.google.gwt.user.client.ui.RootLayoutPanel;
import net.desource.samples.fortune.client.ui.Resources;

/**
 *
 */
public class AppEntryPoint implements EntryPoint {

    public interface AppFactory extends Ginjector {
        App getApp();
    }

    // can override DefaultAppFactory.class with &lt;replace-with> rules in a gwt.xml file
    @GinModules({AppModule.class})
    public interface DefaultAppFactory extends AppFactory {}
    static AppFactory factory = GWT.create(DefaultAppFactory.class);

    static {
        Resources resources = GWT.create(Resources.class);
        resources.styles().ensureInjected();
    }

    public void onModuleLoad() {
        App app = factory.getApp();
        app.run(RootLayoutPanel.get());
    }

}
