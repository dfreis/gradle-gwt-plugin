/*
   Copyright 2011 Distinctive Edge Ltd

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

import org.gradle.api.tasks.compile.AbstractOptions

/**
 *
 * @author Markus Kobler
 */
class JavaOptions extends AbstractOptions {

    boolean fork = true
    boolean failOnError = true

    JavaForkOptions forkOptions = new JavaForkOptions()

    Map systemProperties = [:]
    Map environment = [:]

    Map fieldName2AntMap() {
        [ failOnError: 'failonerror' ]
    }

    def List excludedFieldsFromOptionMap() {
        ['systemProperties','environment','forkOptions']
    }

    def Map optionMap() {
        return super.optionMap() + forkOptions.optionMap();
    }

    JavaOptions fork(Map args) {
        fork = true
        forkOptions.define args
        this
    }
    
}
