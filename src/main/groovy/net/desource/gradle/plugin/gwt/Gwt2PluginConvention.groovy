/*
   Copyright 2011 the original author or authors.

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
package net.desource.gradle.plugin.gwt

import org.gradle.api.Project

/**
 *
 * 
 * @author Markus Kobler
 */
class Gwt2PluginConvention {

    Project project

    List<String> gwtModules

    String excludePattern = ".*/client/.*"

    Gwt2PluginConvention(project) {
        this.project = project
    }

    void setGwtModules(List<String> modules) {
        gwtModules = modules
    }

    void setGwtModule(String module) {
        gwtModules = [module]
    }

    void setGwtVersion(String version) {
        project.logger.warn("gwtVersion Not Supported, explicitly define dependenices")
    }

}
