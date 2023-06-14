package pw.se2.flowershopbackend.services;

import pw.se2.flowershopbackend.models.User;

import java.util.Comparator;

public class OrdersCountsComparator implements Comparator<User> {

    @Override
    public int compare(User user1, User user2) {
        return Integer.compare(user1.getOrdersToDeliver().size(), user2.getOrdersToDeliver().size());
    }

}
