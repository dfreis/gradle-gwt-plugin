package sample.support.mvp;

/**
 *
 */
public class Place {

    private final String name;

    public Place(String name) {
        assert name != null : "Name cannot be null";
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return "Place[" + name + ']';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        return name.equals(((Place) o).name);
    }

    @Override
    public int hashCode() {
        return name.hashCode();
    }

}
