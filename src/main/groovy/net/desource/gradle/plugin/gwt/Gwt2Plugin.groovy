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
import org.gradle.api.Plugin
import org.gradle.api.plugins.JavaPlugin
import org.gradle.api.tasks.SourceSet
import org.gradle.api.plugins.JavaPluginConvention
import org.gradle.api.artifacts.Configuration
import org.gradle.api.artifacts.ConfigurationContainer
import org.gradle.api.plugins.WarPluginConvention
import org.gradle.api.plugins.WarPlugin
import org.gradle.api.artifacts.UnknownConfigurationException
import org.gradle.api.execution.TaskExecutionGraph
import org.gradle.api.artifacts.ExternalModuleDependency
import org.gradle.api.internal.artifacts.dependencies.DefaultExternalModuleDependency
import org.gradle.api.tasks.testing.Test
import org.gradle.api.tasks.bundling.War

/**
 *
 * @author Markus Kobler
 */
class Gwt2Plugin implements Plugin<Project> {

    public static final String GWT_CONFIGURATION_NAME = "gwt";

    public static final String COMPILE_GWT_TASK_NAME = "compileGwt"
    public static final String GWT_DEV_MODE_TASK_NAME = "gwtDevMode"

    public static final String SYNC_COMPILED_GWT_TASK_NAME = "syncCompiledGwt"

    // todo...
    public static final String GWT_WAR_DEV_MODE_TASK_NAME = "gwtWarDevMode"

    void apply(Project project) {
        project.plugins.apply(JavaPlugin.class)

        Gwt2PluginConvention pluginConvention = new Gwt2PluginConvention(project)
        project.convention.plugins.gwt = pluginConvention

        addCompileGwtTask(project)
        addGwtDevModeTask(project)

        configureTestTaskDefaults(project)

        excludeFiles(project)

        // disabled for time being
//        addSyncCompiledGwtTask(project)

        configureConfigurations(project.configurations)
    }

    void addCompileGwtTask(Project project) {

        // this is a bit experimental but will stop all gwt libraries being compiled
        project.tasks.getByName("compileJava") {
            SourceSet mainSourceSet = project.convention.getPlugin(JavaPluginConvention.class).sourceSets.getByName(SourceSet.MAIN_SOURCE_SET_NAME)
            options.compilerArgs.addAll(['-sourcepath', mainSourceSet.java.getAsPath()])
        }

        project.tasks.withType(CompileGwt.class).all { CompileGwt task ->

            task.conventionMapping.modules = { project.convention.getPlugin(Gwt2PluginConvention.class).gwtModules }

            task.buildDir = project.file("build/gwt/out")
            task.workDir  = project.file("build/gwt/work")
            task.extraDir = project.file("build/gwt/extra")
            task.genDir   = project.file("build/gwt/extra")

            task.conventionMapping.classpath = {
                SourceSet mainSourceSet = project.convention.getPlugin(JavaPluginConvention.class).sourceSets.getByName(SourceSet.MAIN_SOURCE_SET_NAME)
                project.files(mainSourceSet.resources.srcDirs,
                              mainSourceSet.java.srcDirs,
                              mainSourceSet.classesDir,
                              mainSourceSet.compileClasspath);
            }

        }

        CompileGwt compileGwt = project.tasks.add(COMPILE_GWT_TASK_NAME, CompileGwt.class)
        compileGwt.dependsOn(JavaPlugin.CLASSES_TASK_NAME)
        compileGwt.description = "Compile GWT Modules"
    }



    void addGwtDevModeTask(Project project) {

        project.tasks.withType(GwtDevMode.class).all { GwtDevMode task ->

            task.conventionMapping.modules = { project.convention.getPlugin(Gwt2PluginConvention.class).gwtModules }

            task.conventionMapping.classpath = {
                SourceSet mainSourceSet = project.convention.getPlugin(JavaPluginConvention.class).sourceSets.getByName(SourceSet.MAIN_SOURCE_SET_NAME)

                // TODO optionally enable reloading of other local modules source code...
                def reloadableResources = project.files(mainSourceSet.resources.srcDirs, mainSourceSet.java.srcDirs)

                project.files(reloadableResources, mainSourceSet.runtimeClasspath)
            }

            task.conventionMapping.warDir = {
                getWebappDir(project)
            }
        }

        GwtDevMode gwtDevMode = project.tasks.add(GWT_DEV_MODE_TASK_NAME, GwtDevMode.class)
        gwtDevMode.dependsOn(JavaPlugin.CLASSES_TASK_NAME)
        gwtDevMode.description = "Run's GWT Developer Mode"

    }

    void addSyncCompiledGwtTask(Project project) {

        project.tasks.withType(SyncCompiledGwt.class).all { SyncCompiledGwt task ->
            task.gwtBuildDir = project.file("build/gwt/out")
            task.webappBase = getWebappDir(project)
        }

        SyncCompiledGwt syncCompiledGwt = project.tasks.add(SYNC_COMPILED_GWT_TASK_NAME, SyncCompiledGwt.class)
        syncCompiledGwt.dependsOn(COMPILE_GWT_TASK_NAME)
        syncCompiledGwt.description = "Copies GWT compiled output to webapp"

    }

    private void configureTestTaskDefaults(final Project project) {

        project.tasks.withType(Test.class).all { Test test ->

            test.dependsOn(COMPILE_GWT_TASK_NAME)

            test.conventionMapping.classpath = {

                def sourceSets = project.convention.getPlugin(JavaPluginConvention.class).sourceSets

                SourceSet testSourceSet = sourceSets.getByName(SourceSet.TEST_SOURCE_SET_NAME);
                SourceSet mainSourceSet = sourceSets.getByName(SourceSet.MAIN_SOURCE_SET_NAME)

                project.files(testSourceSet.java.srcDirs,
                              testSourceSet.runtimeClasspath,
                              mainSourceSet.resources.srcDirs,
                              mainSourceSet.java.srcDirs,
                              mainSourceSet.classesDir,
                              mainSourceSet.compileClasspath);
            }

        }
    }


    private void configureConfigurations(ConfigurationContainer configurationContainer) {
        Configuration gwtConfiguration = configurationContainer.add(GWT_CONFIGURATION_NAME).setVisible(false).
                setDescription("Libraries required to compile this GWT project but not needed at runtime");
        try {
            configurationContainer.getByName(WarPlugin.PROVIDED_COMPILE_CONFIGURATION_NAME).extendsFrom(gwtConfiguration)
        } catch (UnknownConfigurationException ex) {
            configurationContainer.getByName(JavaPlugin.COMPILE_CONFIGURATION_NAME).extendsFrom(gwtConfiguration)
        }
    }

    private File getWebappDir(Project project) {
        def webappDir = project.file("src/main/webapp")
        try {
            webappDir =  project.convention.getPlugin(WarPluginConvention.class).webAppDir
        } catch ( IllegalStateException ex ) {
            // ignore
        }
        return webappDir;
    }

    private void excludeFiles(final Project project) {
        project.tasks.withType(War.class).all { War war ->

            def excludePattern = project.convention.getPlugin(Gwt2PluginConvention.class).excludePattern

            if( excludePattern != null && excludePattern.length() > 0) {
                war.doFirst {
                    copyAction.rootSpec.eachFile { details ->
                        if (details.path.matches(excludePattern)) {
                            war.getLogger().debug("Excluding : {}", details.path);
                            details.exclude()
                        }
                    }
                }
            }
        }
    }

//    XXX re-implement?
//    ====================================================================================================================
//    private void configureGwtDependenciesIfVersionSpecified(final Project project, final Gwt2PluginConvention convention) {
//        project.getGradle().getTaskGraph().whenReady {TaskExecutionGraph taskGraph ->
//
//            if( convention.gwtVersion != null && convention.gwtVersion.trim().length() > 0) {
//
//                def version = convention.gwtVersion.trim()
//
//                ExternalModuleDependency dependency = new DefaultExternalModuleDependency("com.google.gwt", "gwt-dev", version )
//                project.configurations.getByName(GWT_CONFIGURATION_NAME).addDependency(dependency)
//
//                if (project.getTasks().findByName(WarPlugin.WAR_TASK_NAME) != null) {
//
//                    dependency = new DefaultExternalModuleDependency("com.google.gwt", "gwt-user", version )
//                    project.configurations.getByName(WarPlugin.PROVIDED_COMPILE_CONFIGURATION_NAME).addDependency(dependency)
//
//                    dependency = new DefaultExternalModuleDependency("com.google.gwt", "gwt-servlet", version )
//                    project.configurations.getByName(JavaPlugin.RUNTIME_CONFIGURATION_NAME).addDependency(dependency)
//
//                } else {
//
//                    dependency = new DefaultExternalModuleDependency("com.google.gwt", "gwt-user", version )
//                    project.configurations.getByName(JavaPlugin.COMPILE_CONFIGURATION_NAME).addDependency(dependency)
//
//                }
//
//
//            }
//        }
//    }
//
//    private void configureJarTaskDefaults(final Project project, final Gwt2PluginConvention pluginConvention) {
//        Jar jarTask = (Jar) project.getTasks().findByName(JavaPlugin.JAR_TASK_NAME)
//
//        if (jarTask != null) {
//
//            jarTask.doFirst {
//              SourceSet mainSourceSet = project.convention.getPlugin(JavaPluginConvention.class).sourceSets.getByName(SourceSet.MAIN_SOURCE_SET_NAME);
//              if(pluginConvention.gwtArchiveAllSource) {
//                jarTask.from(mainSourceSet.java)
//              } else {
//                jarTask.from(mainSourceSet.java.matching { include("**/client/**") });
//              }
//            }
//        }
//    }

}
