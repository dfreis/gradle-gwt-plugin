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

import org.junit.Before
import org.junit.Test
import org.gradle.testfixtures.ProjectBuilder
import org.gradle.api.plugins.JavaPlugin
import static org.hamcrest.Matchers.*
import static org.junit.Assert.*

import org.gradle.api.Task
import org.hamcrest.Matcher
import org.hamcrest.BaseMatcher
import org.hamcrest.StringDescription
import org.hamcrest.Description
import org.hamcrest.Factory
import org.gradle.api.plugins.WarPlugin

/**
 * 
 */
class Gwt2PluginTest {

    private Project project
    private Gwt2Plugin gwt2Plugin

    @Before
    public void setUp() {
        project = ProjectBuilder.builder().build()
        new WarPlugin().apply(project)
        gwt2Plugin = new Gwt2Plugin()
    }

    @Test public void appliesJavaPluginsAndAddsConvention() {
        gwt2Plugin.apply(project)

        assertTrue(project.getPlugins().hasPlugin(JavaPlugin));
        assertThat(project.convention.plugins.gwt, instanceOf(Gwt2PluginConvention))
    }

    @Test public void addsTasksToProject() {
        gwt2Plugin.apply(project)

        def task = project.tasks[Gwt2Plugin.COMPILE_GWT_TASK_NAME]
        assertThat(task, instanceOf(CompileGwt))
        assertThat(task, dependsOn(JavaPlugin.CLASSES_TASK_NAME))

    }


    @Factory
    public static Matcher<Task> dependsOn(final String... tasks) {
        return dependsOn(equalTo(new HashSet<String>(Arrays.asList(tasks))));
    }

    @Factory
    public static Matcher<Task> dependsOn(final Matcher<? extends Iterable<String>> matcher) {
        return new BaseMatcher<Task>() {
            public boolean matches(Object o) {
                Task task = (Task) o;
                Set<String> names = new HashSet<String>();
                Set<? extends Task> depTasks = task.getTaskDependencies().getDependencies(task);
                for (Task depTask : depTasks) {
                    names.add(depTask.getName());
                }
                boolean matches = matcher.matches(names);
                if (!matches) {
                    StringDescription description = new StringDescription();
                    matcher.describeTo(description);
                    System.out.println(String.format("expected %s, got %s.", description.toString(), names));
                }
                return matches;
            }

            public void describeTo(Description description) {
                description.appendText("a Task that depends on ").appendDescriptionOf(matcher);
            }
        };
    }


}


