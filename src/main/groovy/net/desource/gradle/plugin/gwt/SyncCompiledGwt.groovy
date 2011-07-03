package net.desource.gradle.plugin.gwt

import org.gradle.api.DefaultTask
import org.gradle.api.file.FileCollection
import org.gradle.api.tasks.InputFiles
import org.gradle.api.tasks.OutputDirectory
import org.gradle.api.tasks.TaskAction
import org.gradle.api.tasks.Sync

/**
 *
 * XXX needs fixing
 *
 */
class SyncCompiledGwt extends DefaultTask {

    private File gwtBuildDir
    private File webappBase

    private FileCollection compiledModules

    @InputFiles
    File getGwtBuildDir() {
        gwtBuildDir
    }

    void setGwtBuildDir(File file) {
        this.gwtBuildDir = file
    }

    @OutputDirectory
    File getWebappBase() {
        return webappBase
    }

    void setWebappBase(File webappBase) {
        this.webappBase = webappBase
    }

    @TaskAction
    def sync() {
        for( File file : gwtBuildDir.listFiles() ) {
            if( "WEB-INF".equals(file.name) ) continue;
            Sync sync = new Sync()
            sync.from(file);
            sync.into(new File(file.name, webappBase.name))
            sync.execute();
        }
    }

}
